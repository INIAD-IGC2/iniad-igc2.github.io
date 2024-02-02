
"""
html等を正常に読み込むために、ローカルサーバーを立てる
http://localhost:8000
"""


import os
import re
import http.server

class MyHandler(http.server.SimpleHTTPRequestHandler):

    def send_error(self, code, message=None):
        if code == 404:
            f = open("404.html", 'r',encoding="utf-8_sig")
            web404data = f.read();
            f.close()
            self.error_message_format = web404data
        http.server.SimpleHTTPRequestHandler.send_error(self, code, message)


if __name__ == '__main__':
    httpd = http.server.HTTPServer(('', 8000), MyHandler)
    print("Serving app on port 8000 ...")
    httpd.serve_forever()


