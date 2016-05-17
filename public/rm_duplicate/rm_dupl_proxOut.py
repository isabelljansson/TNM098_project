#!/usr/bin/env python
import json

with open('proxOut-MC2.json') as f:
		# Read in data from JSON file
    data = ''
    for line in f.readlines():
        data += line.strip()
    json_data = json.loads(data)

    result = list()
    items_set = set()
    # Go through every item and look for duplicates
    for x in json_data:
        # See if the items unique name doesn't exists
        if not json.dumps(x['message']['datetime'])+json.dumps(x['message']['proxCard'])+json.dumps(x['message']['floor']) in items_set:
            # Add it to the set, it has been visited
            items_set.add(json.dumps(x['message']['datetime'])+json.dumps(x['message']['proxCard'])+json.dumps(x['message']['floor']))
            # Add it to the result
            result.append(x)
        else:
        		# Print removed item
            print(x['message'])
    # Print out amount of removed files
    print('{} items removed'.format(len(json_data)-len(result)))
    # Write to new file
    with open('proxOut-MC2-clean.json','w') as nf:
        json.dump(result, nf, indent=4, sort_keys=True)
