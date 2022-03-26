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

def bring_out_blue(img: Image):
    gray = img.convert('L')
    hsv = img.convert('HSV')

    img = np.asarray(img)
    hsv = np.asarray(hsv)
    gray = np.asarray(gray)

    lower_blue = np.array([90, 50, 70])
    upper_blue = np.array([128, 255, 255])

    mask = np.zeros(img.shape[:2], dtype="uint8")
    mask[
        (hsv[:, :, 0] >= lower_blue[0]) & (hsv[:, :, 0] <= upper_blue[0]) &
        (hsv[:, :, 1] >= lower_blue[1]) & (hsv[:, :, 1] <= upper_blue[1]) &
        (hsv[:, :, 2] >= lower_blue[2]) & (hsv[:, :, 2] <= upper_blue[2])] = 255

    mask_inv = np.full(img.shape[:2], 255, dtype="uint8")
    mask_inv = mask ^ mask_inv

    res = img.copy()
    res[mask == 0] = 0

    back = gray.copy()
    back[mask_inv == 0] = 0
    back = np.stack((back,)*3, axis=-1)

    res = res + back

    return Image.fromarray(res)

image = Image.open(io.BytesIO(base64.b64decode(image_data)))
image = image.convert('L').convert('RGB')
image = convert_image_to_blue(image)
image_io = io.BytesIO()
image.save(image_io, 'jpeg')
encoded_image = base64.b64encode(image_io.getvalue())
str(encoded_image)[2:-1]