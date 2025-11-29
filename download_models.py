"""
Pre-download models to Modal volume for fast loading
Run once: modal run download_models.py
"""

import modal

app = modal.App("lustlingual-model-downloader")

# Volume to store models
volume = modal.Volume.from_name("lustlingual-models", create_if_missing=True)

image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install(
        "huggingface_hub",
        "transformers",
        "torch",
    )
)

MODELS_TO_DOWNLOAD = [
    # Primary: Dolphin Mistral - uncensored, NSFW-friendly
    "TheBloke/dolphin-2.2.1-mistral-7B-AWQ",

    # Secondary: OpenHermes 2.5 - excellent for roleplay, uncensored
    "TheBloke/OpenHermes-2.5-Mistral-7B-AWQ",

    # Large UNCENSORED: Dolphin 2.6 Mixtral 8x7B - ~26GB
    # This is the UNCENSORED version trained by Eric Hartford (cognitivecomputations)
    "TheBloke/dolphin-2.6-mixtral-8x7b-AWQ",
]


@app.function(
    image=image,
    volumes={"/models": volume},
    timeout=3600,  # 1 hour for downloads
)
def download_models():
    """Download models to the volume"""
    from huggingface_hub import snapshot_download
    import os

    for model_id in MODELS_TO_DOWNLOAD:
        print(f"\n{'='*60}")
        print(f"Downloading: {model_id}")
        print(f"{'='*60}\n")

        # Create model directory
        model_name = model_id.replace("/", "--")
        model_path = f"/models/{model_name}"

        try:
            snapshot_download(
                repo_id=model_id,
                local_dir=model_path,
                local_dir_use_symlinks=False,
            )
            print(f"✅ Downloaded {model_id} to {model_path}")
        except Exception as e:
            print(f"❌ Failed to download {model_id}: {e}")

    # List what's in the volume
    print(f"\n{'='*60}")
    print("Models in volume:")
    print(f"{'='*60}")
    for item in os.listdir("/models"):
        path = f"/models/{item}"
        if os.path.isdir(path):
            size = sum(
                os.path.getsize(os.path.join(dirpath, filename))
                for dirpath, dirnames, filenames in os.walk(path)
                for filename in filenames
            ) / (1024**3)
            print(f"  📁 {item} ({size:.2f} GB)")

    # Commit the volume
    volume.commit()
    print("\n✅ Volume committed!")


@app.local_entrypoint()
def main():
    download_models.remote()
    print("\n🎉 All models downloaded to Modal volume!")
