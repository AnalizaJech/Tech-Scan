from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
paths = sorted((root / "artifacts/gif").glob("[0-9][0-9].jpg"))
if not paths:
    raise SystemExit("Faltan capturas reales en artifacts/gif/00.jpg, 01.jpg...")
frames = []
for path in paths:
    with Image.open(path) as image:
        image = image.convert("RGB")
        image = image.resize((960, round(image.height * 960 / image.width)), Image.Resampling.LANCZOS)
        frames.append(image.quantize(colors=192, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE))
output = root / "docs/media/workflow.gif"
frames[0].save(output, save_all=True, append_images=frames[1:], duration=[2400] * len(frames), loop=0, optimize=True)
with Image.open(output) as image:
    print(f"{output}: {image.n_frames} frames, {image.size}, {output.stat().st_size} bytes")
