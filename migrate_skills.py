# -*- coding: utf-8 -*-
import io
import json
import os

file_path = r'e:\prototypes\ArkLines\src\data\skills\characters_skills.json'

with io.open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Define replacements
replacements = {
    "sp": "atb",
    "stagger": "poise",
    "spCost": "atbCost",
    "gaugeGain": "uspGain",
    "gaugeMax": "uspMax",
    "gaugeReply": "uspReply",
    "teamGaugeGain": "teamUspGain",
    "accept_team_gauge": "accept_team_usp",
    "attack_gaugeGain": "attack_uspGain"
}

def migrate_obj(obj):
    if isinstance(obj, dict):
        new_obj = {}
        for k, v in obj.items():
            # In Python 2, keys might be unicode
            k_str = k.encode('utf-8') if isinstance(k, unicode) else k
            new_key_str = replacements.get(k_str, k_str)
            new_key = new_key_str.decode('utf-8') if isinstance(k, unicode) else new_key_str
            
            # Recursive call for value
            new_val = migrate_obj(v)
            
            # Special handling for path strings
            if isinstance(new_val, (str, unicode)):
                if new_val.startswith(u'/icons/'):
                    new_val = new_val.replace(u'/icons/', u'dist/assets/icons/')
                elif new_val.startswith(u'/avatars/'):
                    new_val = new_val.replace(u'/avatars/', u'dist/assets/avatars/')
                
                # Special handling for 'stagger' as a value
                if new_val == u'stagger':
                    new_val = u'poise'
            
            new_obj[new_key] = new_val
        return new_obj
    elif isinstance(obj, list):
        return [migrate_obj(i) for i in obj]
    elif isinstance(obj, (str, unicode)):
        if obj == u'stagger':
            return u'poise'
        return obj
    else:
        return obj

migrated_data = migrate_obj(data)

with io.open(file_path, 'w', encoding='utf-8') as f:
    # ensure_ascii=False is important for non-ASCII characters
    content = json.dumps(migrated_data, ensure_ascii=False, indent=2)
    # in python 2, json.dumps returns a byte string if ensure_ascii=False
    if isinstance(content, str):
        content = content.decode('utf-8')
    f.write(content)

print("Migration completed successfully.")
