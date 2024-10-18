normalize: ./sounds/*.wav
	for file in $^; do ffmpeg-normalize $${file} --force --normalization-type peak --target-level -1 --output $${file}; done