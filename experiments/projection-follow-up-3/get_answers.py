import json

with open('projection-only/raw_results_all') as fid:
    data = json.load(fid)

with open('projection-only/answers', 'a') as the_file:
    for i in range(0, len(data)):
        the_file.write(data[i]['Answer'] + '\n\n')
