from PIL import Image
import glob
import pathlib


fromFile = "/Users/Kirihata/Documents/iniad-igc2.github.io/img/works/2022"
toFile = "./img/works/2022"


p_temp = list(pathlib.Path(fromFile).glob('*.png'))
for file in p_temp:
    print(file.name)
    name = file.name.split('.')[0]
    #print(name)

    im = Image.open(file)
    im = im.convert("RGB")
    im.save(toFile+"/"+name+".jpg", quality = 75)
