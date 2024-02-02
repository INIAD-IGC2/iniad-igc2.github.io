from pdf2image import convert_from_path
#python3 -m pip install pdf2image
#Popplerが必要
import glob
import pathlib

POPPLER_PATH = "/Users/Kirihata/Desktop/poppler-23.11.0/Library/bin"

fromFile = "./2022作品.pdf"
toFolder = "./img/works/2022/titles"


# PDFファイルのパス
#pdf_path = Path(fromFile)
#outputのファイルパス
#img_path=Path("./image")

jpgoption = {"quality":75,"progressive":True,"optimize":True}
#imgsize = (1280,720)
imgsize = (2048,1152)
convert_from_path(fromFile, size=imgsize, first_page=2, fmt='jpg', jpegopt=jpgoption, output_folder=toFolder, output_file="title", poppler_path=POPPLER_PATH)





