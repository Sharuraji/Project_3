import sqlite3
import pandas as pd

from pathlib import Path
database_path = "../Resources/APYIndia.sqlite"
Path(database_path).touch()

conn = sqlite3.connect(database_path)
c = conn.cursor()

c.execute('''CREATE TABLE APYIndia ( ID integer primary key autoincrement, State text,District text,Crop text,Crop_Year int,Season text,Area float,Production float,Yield float)''' )

csv_APY_India = pd.read_csv("../Resources/APYIndia.csv")
csv_APY_India.to_sql("APYIndia", conn,  if_exists='append', index=False)

conn.close()