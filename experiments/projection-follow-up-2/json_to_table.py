import json
import pandas as pd

with open('projection-only/answers') as answers:
    lines = answers.readlines()
    data = json.loads(lines[0])
    df = pd.DataFrame(data)
    df['participant'] = 1
    for i in range(1, len(lines)):
        datai = json.loads(lines[i])
        dfi = pd.DataFrame(datai)
        dfi['participant'] = i + 1
        df = pd.concat([df, dfi])
df.to_csv('projection-only/table.csv')
