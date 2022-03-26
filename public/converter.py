#!/usr/bin/env python3
from PIL import Image
from js import image_data
import numpy as np
import base64
import os
import io

def convert_image_to_blue(image: Image):
    height, width = image.size
    for y in range(height):
        for x in range(width):
            _, _, b = image.getpixel((y, x))
            image.putpixel((y,x), (0,0,b))
    return image

image = Image.open(io.BytesIO(base64.b64decode(image_data)))
image = image.convert('L').convert('RGB')
image = convert_image_to_blue(image)
image_io = io.BytesIO()
image.save(image_io, 'jpeg')
encoded_image = base64.b64encode(image_io.getvalue())
str(encoded_image)[2:-1]