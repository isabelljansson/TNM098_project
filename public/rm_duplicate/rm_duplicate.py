#!/usr/bin/env python
import json
import glob

with open('MCBuildingProxSensorData/json/proxMobileOut-MC2.json') as f:
    data = ''
    for line in f.readlines():
        data += line.strip()
    json_data = json.loads(data)
    #print(dir(json_data))

    result = list()
    items_set = set()
    for x in json_data:
        print(x['message'])
        if not x['message'] in items_set:
            items_set.add(x['message'])
            result.append(x)
        else:
            print(x)

    print('{} items removed'.format(len(json_data)-len(result)))
    with open('new_file.json','w') as nf:
        json.dump(result, nf, indent=4, sort_keys=True)
    print(result)
