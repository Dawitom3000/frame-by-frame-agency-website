import AVFoundation
import CoreGraphics
import Foundation
import ImageIO
import UniformTypeIdentifiers

struct ClipPlan {
    let filename: String
    let startSeconds: Double
    let durationSeconds: Double
}

let args = CommandLine.arguments
guard args.count >= 4 else {
    fputs("Usage: swift scripts/create_hero_mashup.swift <source-dir> <output-mp4> <poster-jpg>\n", stderr)
    exit(2)
}

let sourceDir = URL(fileURLWithPath: args[1], isDirectory: true)
let outputURL = URL(fileURLWithPath: args[2])
let posterURL = URL(fileURLWithPath: args[3])
let fm = FileManager.default

try? fm.createDirectory(at: outputURL.deletingLastPathComponent(), withIntermediateDirectories: true)
try? fm.removeItem(at: outputURL)
try? fm.removeItem(at: posterURL)

let sourceURLs = (try? fm.contentsOfDirectory(at: sourceDir, includingPropertiesForKeys: nil, options: [.skipsHiddenFiles])) ?? []

guard !sourceURLs.isEmpty else {
    fputs("No source videos found in \(sourceDir.path)\n", stderr)
    exit(1)
}

let composition = AVMutableComposition()
guard let compositionTrack = composition.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid) else {
    fputs("Could not create video composition track.\n", stderr)
    exit(1)
}

let renderSize = CGSize(width: 1920, height: 1080)
let videoComposition = AVMutableVideoComposition()
videoComposition.renderSize = renderSize
videoComposition.frameDuration = CMTime(value: 1, timescale: 30)

var instructions: [AVMutableVideoCompositionInstruction] = []
var currentTime = CMTime.zero
var usedClips = 0

func fittedTransform(for sourceTrack: AVAssetTrack) -> CGAffineTransform {
    let natural = sourceTrack.naturalSize
    let preferred = sourceTrack.preferredTransform
    let transformedRect = CGRect(origin: .zero, size: natural).applying(preferred)
    let orientedSize = CGSize(width: abs(transformedRect.width), height: abs(transformedRect.height))
    let scale = max(renderSize.width / orientedSize.width, renderSize.height / orientedSize.height)
    let scaledSize = CGSize(width: orientedSize.width * scale, height: orientedSize.height * scale)
    let centerOffset = CGPoint(x: (renderSize.width - scaledSize.width) / 2, y: (renderSize.height - scaledSize.height) / 2)

    var transform = preferred
    transform = transform.concatenating(CGAffineTransform(translationX: -transformedRect.origin.x, y: -transformedRect.origin.y))
    transform = transform.concatenating(CGAffineTransform(scaleX: scale, y: scale))
    transform = transform.concatenating(CGAffineTransform(translationX: centerOffset.x, y: centerOffset.y))
    return transform
}

let clipPlans: [ClipPlan] = [
    ClipPlan(filename: "Afar.mov", startSeconds: 6.0, durationSeconds: 5.0),
    ClipPlan(filename: "0222.mov", startSeconds: 5.0, durationSeconds: 2.5),
    ClipPlan(filename: "Afar.mov", startSeconds: 22.0, durationSeconds: 5.0),
    ClipPlan(filename: "IMG_2835.mov", startSeconds: 2.0, durationSeconds: 2.5),
    ClipPlan(filename: "IMG_2837.mov", startSeconds: 1.5, durationSeconds: 2.5),
    ClipPlan(filename: "IMG_1216.mov", startSeconds: 1.5, durationSeconds: 2.5),
    ClipPlan(filename: "Afar.mov", startSeconds: 45.0, durationSeconds: 5.0),
    ClipPlan(filename: "IMG_1853.mov", startSeconds: 1.5, durationSeconds: 2.5),
    ClipPlan(filename: "IMG_1859.mov", startSeconds: 1.5, durationSeconds: 2.5),
    ClipPlan(filename: "IMG_1861.mov", startSeconds: 0.5, durationSeconds: 2.5),
    ClipPlan(filename: "Afar.mov", startSeconds: 55.0, durationSeconds: 5.0),
    ClipPlan(filename: "-2599254573610965103.mov", startSeconds: 2.0, durationSeconds: 2.5),
    ClipPlan(filename: "v09044g40000d07or4vog65lrajk416g.mov", startSeconds: 2.0, durationSeconds: 2.5),
    ClipPlan(filename: "Afar.mov", startSeconds: 65.0, durationSeconds: 6.0)
]

for plan in clipPlans {
    guard let fileURL = sourceURLs.first(where: { $0.lastPathComponent.lowercased() == plan.filename.lowercased() }) else {
        fputs("Warning: Could not find video file \(plan.filename) in \(sourceDir.path)\n", stderr)
        continue
    }

    let asset = AVURLAsset(url: fileURL)
    guard let sourceTrack = asset.tracks(withMediaType: .video).first else {
        fputs("Warning: No video track found in \(plan.filename)\n", stderr)
        continue
    }

    let start = CMTime(seconds: plan.startSeconds, preferredTimescale: 600)
    let duration = CMTime(seconds: plan.durationSeconds, preferredTimescale: 600)
    let range = CMTimeRange(start: start, duration: duration)

    do {
        try compositionTrack.insertTimeRange(range, of: sourceTrack, at: currentTime)

        let layerInstruction = AVMutableVideoCompositionLayerInstruction(assetTrack: compositionTrack)
        layerInstruction.setTransform(fittedTransform(for: sourceTrack), at: currentTime)

        let instruction = AVMutableVideoCompositionInstruction()
        instruction.timeRange = CMTimeRange(start: currentTime, duration: duration)
        instruction.layerInstructions = [layerInstruction]
        instructions.append(instruction)

        currentTime = currentTime + duration
        usedClips += 1
    } catch {
        fputs("Skipping \(plan.filename): \(error.localizedDescription)\n", stderr)
    }
}

guard usedClips > 0 else {
    fputs("No usable clips could be inserted.\n", stderr)
    exit(1)
}

videoComposition.instructions = instructions

guard let export = AVAssetExportSession(asset: composition, presetName: AVAssetExportPreset1920x1080) else {
    fputs("Could not create export session.\n", stderr)
    exit(1)
}

export.outputURL = outputURL
export.outputFileType = .mp4
export.videoComposition = videoComposition
export.shouldOptimizeForNetworkUse = true
export.metadata = []

let semaphore = DispatchSemaphore(value: 0)
export.exportAsynchronously {
    semaphore.signal()
}
semaphore.wait()

guard export.status == .completed else {
    fputs("Export failed: \(export.error?.localizedDescription ?? "Unknown error")\n", stderr)
    exit(1)
}

let outputAsset = AVURLAsset(url: outputURL)
let generator = AVAssetImageGenerator(asset: outputAsset)
generator.appliesPreferredTrackTransform = true
generator.maximumSize = CGSize(width: 1920, height: 1080)

do {
    let image = try generator.copyCGImage(at: CMTime(seconds: 1.0, preferredTimescale: 600), actualTime: nil)
    if let destination = CGImageDestinationCreateWithURL(posterURL as CFURL, UTType.jpeg.identifier as CFString, 1, nil) {
        CGImageDestinationAddImage(destination, image, [
            kCGImageDestinationLossyCompressionQuality: 0.82
        ] as CFDictionary)
        CGImageDestinationFinalize(destination)
    }
} catch {
    fputs("Poster generation failed: \(error.localizedDescription)\n", stderr)
}

print("Created \(outputURL.path)")
print("Created \(posterURL.path)")
print("Used \(usedClips) source clips")
