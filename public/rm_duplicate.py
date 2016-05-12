#!/usr/bin/env python
import json
import glob

#with open('MCBuildingProxSensorData/json/f1z8a-MC2.json') as f:
for json_file in glob.glob('MCBuildingProxSensorData/json/*.json'):
    with open(json_file) as f:
        data = ''
        for line in f.readlines():
            data += line.strip()
        json_data = json.loads(data)
        #print(dir(json_data))

        result = list()
        items_set = set()
        for x in json_data:
            #print(x['message']['Date/Time'])
            if not x['message']['Date/Time'] in items_set:
                items_set.add(x['message']['Date/Time'])
                result.append(x)
            else:
                print(x)

        print('{} items removed'.format(len(json_data)-len(result)))
        #with open('new_file.json','w') as nf:
        #    json.dump(result, nf, indent=4, sort_keys=True)
        #print(result)

        # load json objects to dictionaries
        #jsons = map(json.loads, f)

        #result = list()
        #items_set = set()
        #for x in jsons:
        #    # only add unseen items (referring to 'title' as key)
        #    if not x['Time/Date'] in items_set:
        #        # mark as seen
        #        items_set.add(x['Time/Date'])
        #        # add to results
        #        result.append(x)

        ## write to new json file
        #with open('new_file.json' ,'w') as nf:
        #    json.dump(result, nf)

        #print( result )
