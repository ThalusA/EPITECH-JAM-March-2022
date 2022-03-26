#!/usr/bin/env python3
from PIL import Image
from js import imageId

def convert_image_to_blue(image: Image):
    data = image.load()
    height, width = image.size
    for y in range(height):
        for x in range(width):
            _, _, b = data[y, x]
            data[y, x] = 0, 0, b

image = Image.open(f"/images/image-{imageId}").convert('L').convert('RGB')
image = convert_image_to_blue(image)
image.save(f"/images/image-{imageId}")