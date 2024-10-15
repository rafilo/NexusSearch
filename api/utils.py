import re
import uuid
from datetime import datetime
from typing import Any, List, Union

import pytz
from bs4 import BeautifulSoup
from flask import jsonify

import os

from flask.cli import load_dotenv
from openpyxl import Workbook


def get_file_name_and_type(file_name: str) -> (str, str):
    ''' for window only Eg: xxxx.pdf -> ("xxxx", ".pdf") '''

    pattern = r'([^\\/:*?"<>|\r\n]+)(\.[^\\/:*?"<>|\r\n]+)$'
    match = re.search(pattern, file_name)

    file_name = ""
    file_type = ""

    if match:
        file_name = match.group(1)
        file_type = match.group(2)
    return file_name, file_type


def get_permissions(file_path: str) -> Union[List[str], None]:
    """ for window only"""
    pattern = re.compile(
        r'../docs(?:\\(?P<department>[^\\]+))?(?:\\(?P<user_name>[^\\]+))?(?:\\(?P<folder_name>[^\\]+))?\\'
    )

    match = pattern.search(file_path)

    if match:
        # 提取部门、用户名和文件夹名
        department = match.group('department')
        user_name = match.group('user_name')
        folder_name = match.group('folder_name')

        # 处理权限列表
        permissions = []
        if department:
            permissions.append(department)
        if user_name:
            permissions.append(user_name)
        if folder_name:
            permissions.append(f"{user_name}-{folder_name}")
        # print("----------")
        # print(f"Path: {file_path}")
        # print(f"Department: {department}")
        # print(f"User Name: {user_name}")
        # print(f"Folder Name: {folder_name}")
        # print(f"Permissions: {permissions}")
        return permissions
    else:
        print(f"Path: {file_path} - No match found")
        return None


# def get_table():
#     answer = """
#     <p>Some text before the table.</p>
#     <Table>
#         <thead>
#             <tr>
#                 <th>Header 1</th>
#                 <th>Header 2</th>
#             </tr>
#         </thead>
#         <tbody>
#             <tr>
#                 <td>Row 1, Cell 1</td>
#                 <td>Row 1, Cell 2</td>
#             </tr>
#             <tr>
#                 <td>Row 2, Cell 1</td>
#                 <td>Row 2, Cell 2</td>
#             </tr>
#         </tbody>
#     </table>
#     <p>Some text after the table.</p>
#     """
#
#     # 正则表达式匹配 <th> 和 <td> 标签的内容
#     header_pattern = re.compile(r'<th>(.*?)</th>')
#     row_pattern = re.compile(r'<td>(.*?)</td>')
#
#     # 提取表头
#     headers = header_pattern.findall(answer)
#
#     # 提取表格行数据
#     rows = row_pattern.findall(answer)
#
#     # 将表头和行数据格式化
#     output = []
#     output.append(f"| {' | '.join(headers)} |")
#
#     # 每行有两个单元格，因此需要按每两个元素分组
#     for i in range(0, len(rows), 2):
#         output.append(f"| {rows[i]} | {rows[i + 1]} |")
#
#     # 将结果写入 txt 文件
#     with open('output.txt', 'w') as f:
#         for line in output:
#             f.write(line + '\n')
#
#     # 打印结果
#     for line in output:
#         print(line)
#
#
# get_table()
table_regex = re.compile(r'<Table(?:\s+[^>]*)?>.*?</Table>', re.DOTALL)
# BACKEND_URL = os.getenv("BACKEND_URL")

BACKEND_URL = os.getenv("BACKEND_URL")
def exist_new_table(last_table_count: int, html_content: str) -> bool:
    """Check if there is a new table in the HTML content"""
    matches = table_regex.findall(html_content)
    return len(matches) > last_table_count


def generate_button_html(file_name: str) -> str:
    """Generate HTML string for a download button"""
    button_html = f"""<a className="download_link" href="{BACKEND_URL}/api/files/{file_name}" download="{BACKEND_URL}/api/files/{file_name}" class="button">Export</a><br>"""
    return button_html


def extract_table_content(html_content: str) -> Union[Workbook, None]:
    """Extract table content from HTML and convert to Excel Workbook"""
    soup = BeautifulSoup(html_content, 'html.parser')
    table = soup.find('table')

    if not table:
        return None

    headers = []
    rows = []

    # Extract headers and rows from <tr> elements
    rows_elements = table.find_all('tr')
    if rows_elements:
        # The first <tr> is the header row
        header_row = rows_elements[0]
        headers = [th.get_text(strip=True) for th in header_row.find_all('th')]

        # The rest of the <tr> elements are data rows
        for row in rows_elements[1:]:
            cells = [td.get_text(strip=True) for td in row.find_all('td')]
            if cells:
                rows.append(cells)

    # Create a new Excel Workbook
    wb = Workbook()
    ws = wb.active

    # Write headers to the first row
    if headers:
        ws.append(headers)

    # Write rows to the subsequent rows
    for row in rows:
        ws.append(row)

    return wb


def create_table(html_content: str) -> str:
    """Generate .xlsx file and return the file"""
    if not os.path.exists("./files"):
        os.makedirs("./files")

    file_id = uuid.uuid4()
    file_path = f"./files/{file_id}.xlsx"

    # Extract table content
    workbook = extract_table_content(html_content)

    if workbook:
        # Save content to an Excel file
        workbook.save(file_path)
        return f"{file_id}.xlsx"
    else:
        return "No tables found"


def get_table(answer):
    # 正则表达式检查是否同时包含 <Table> 和 </table> 标签
    table_start_pattern = re.compile(r'<Table\b[^>]*>', re.IGNORECASE)
    table_end_pattern = re.compile(r'</Table>', re.IGNORECASE)

    has_table_start = bool(table_start_pattern.search(answer))
    has_table_end = bool(table_end_pattern.search(answer))

    if not (has_table_start and has_table_end):
        return

    # 正则表达式匹配 <th> 和 <td> 标签的内容
    header_pattern = re.compile(r'<th>(.*?)</th>')
    row_pattern = re.compile(r'<td>(.*?)</td>')

    # 提取表头
    headers = header_pattern.findall(answer)

    # 提取表格行数据
    rows = row_pattern.findall(answer)

    # 将表头和行数据格式化
    output = []
    output.append(f"| {' | '.join(headers)} |")

    # 每行有两个单元格，因此需要按每两个元素分组
    for i in range(0, len(rows), 2):
        output.append(f"| {rows[i]} | {rows[i + 1]} |")

    filename = os.path.join(os.path.dirname(__file__), './docs/output.txt')

    # 将结果写入 txt 文件
    with open(filename, 'w', encoding='utf-8') as f:
        for line in output:
            f.write(line + '\n')


def timestamp_to_NZ_date(timestamp: int) -> str:
    # 将毫秒时间戳转换为秒
    timestamp_seconds = timestamp / 1000

    # 转换为UTC时间的 datetime 对象
    utc_time = datetime.utcfromtimestamp(timestamp_seconds)

    # 设置新西兰时间 (NZT)
    nzt_timezone = pytz.timezone('Pacific/Auckland')

    # 将 UTC 时间转换为新西兰时间
    nzt_time = utc_time.replace(tzinfo=pytz.utc).astimezone(nzt_timezone)

    # 格式化日期时间
    nzt_time_formatted = nzt_time.strftime('%Y-%m-%d %H:%M:%S')
    return nzt_time_formatted


def return_message(message: str = "", data: Any = "", error: str = "", status_code: int = None):
    """
    @param: message: optional
    @param: data: optional
    @param: error: optional
    @param: status_code: required
    """

    if status_code is None:
        raise ValueError("Status code must be provided")
    if not isinstance(status_code, int):
        raise ValueError("Status code must be an integer")

    response = {
        "message": message,
        "data": data,
        "error": error
    }
    return jsonify(response), status_code
