import pdfkit
from datetime import datetime
from jinja2 import Template
import random
from urllib.parse import quote
from pdf2image import convert_from_path
import os

# 指定 wkhtmltopdf 可执行文件路径
config = pdfkit.configuration(wkhtmltopdf='/usr/local/bin/wkhtmltopdf')

render_path = 'static/template/rendered/'

event_image_base_path = '../../ImageBase/'


##########################    block 1: 用于转换tags和string
def ListToString(tag_list):
    """
     把tag_list 例如[a,b,c]转换为字符串格式的a,b,c  便于数据库保存
    """
    return ",".join(tag_list)


def StringToList(tag_string):
    return tag_string.split(",")
###########################    end block 1


##########################    block 2: 把带{{ }}的html模版用Jinja2渲染成填了空的html

def render_template(template_html,context_dict):
    with open(template_html, "r", encoding="utf-8") as file:
        template_str = file.read()
    template = Template(template_str)
    rendered_html = template.render(context_dict)
    output_path=render_path+f'render_{random.randint(1, 10000)}.html'
    with open(output_path, 'w', encoding='utf-8') as file:
        file.write(rendered_html)
    return output_path
    
###########################    end block 2    
        


##########################    block 3: 生成diary pdf
diary_options = {
        'page-size': 'A4',
        'margin-top': '0mm',
        'margin-right': '0mm',
        'margin-bottom': '0mm',
        'margin-left': '0mm',
        'encoding': 'utf-8',
        "enable-local-file-access":True,
        "disable-smart-shrinking":True,   #终于好了，该死的wkhtmltopdf，愚蠢至极。
        'dpi': 96,
    }

covers_path='../covers/'  #注意，似乎只能用relative路径（相对于渲染出来的html）
papers_path='../papers/'
current_directory = os.path.dirname(os.path.abspath(__file__))

def GenerateDiaryPDF(event_list, cover_idx, paper_idx, output_path="diary.pdf"):
    rendered_files=[]
    
    #absolute_path_cover = quote(os.path.join(current_directory, covers_path+f'cover_{cover_idx}.png'), safe="")

    cover=render_template('static/template/htmls/cover.html',{'background_img':covers_path+f'cover_{cover_idx}.png','title':'Welcome to My Diary','date':'2023年11月12日'})
    rendered_files.append(cover)
    
    for event in event_list:
        if event['type']=='event':
            page=render_template('static/template/htmls/page.html',{'background_img':papers_path+f'paper_{paper_idx}.png','title':event['title'],'text':event['content'],'date':event['date'],'image':event_image_base_path+event['event_id']+'/'+event['imgList'][0]})
        else:
            page=render_template('static/template/htmls/page.html',{'background_img':papers_path+f'paper_{paper_idx}.png','title':event['title'],'text':event['content'],'date':event['date']})
        rendered_files.append(page)

    #  将多个 HTML 文件合并为一个 PDF
    pdfkit.from_file(rendered_files, output_path=output_path, options=diary_options)
    
    for file in rendered_files:
        os.remove(file)
    
    print(f"Diary PDF generated at: {output_path}")
    
###########################    end block 3


##########################    block 4: pdf转图片，用到pdf2image，依赖poppler

def GenerateThumbnail(pdf_path, output_folder,max_page=5, resolution=100):
    images = convert_from_path(pdf_path,first_page=1,last_page=max_page, dpi=resolution) #如果总页数小于max_page，会自动处理
    for i, image in enumerate(images):
        thumbnail_path = f"{output_folder}/thumbnail_page_{i + 1}.jpg"
        image.save(thumbnail_path, 'JPEG')
    
    return len(images)



   










