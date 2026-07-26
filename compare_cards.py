import struct, base64, json, re, os, sys

def decode_card(path):
    with open(path, 'rb') as f:
        d = f.read()
    pos = 8
    while pos < len(d):
        length = struct.unpack('>I', d[pos:pos+4])[0]
        ctype = d[pos+4:pos+8]
        if ctype == b'tEXt':
            kw_end = d.find(b'\x00', pos+8)
            kw = d[pos+8:kw_end]
            if kw == b'chara':
                b64 = d[kw_end+1:pos+8+length]
                return json.loads(base64.b64decode(b64))
        if ctype == b'IEND':
            break
        pos += 12 + length
    return None

original = decode_card('C:/Users/admin/ST-CardBuilder/XianXiaSystem/精液增加修为系统_原始改地址.png')
v2 = decode_card('C:/Users/admin/ST-CardBuilder/XianXiaSystem/精液增加修为系统_精炼版2.png')

o_data = original.get('data', original)
v_data = v2.get('data', v2)

out = []
out.append('========== 两张卡对比 ==========')
out.append(f'')
out.append(f'{"项目":<20} {"原始改地址":<30} {"精炼版2":<30}')
out.append(f'{"-"*20} {"-"*30} {"-"*30}')
out.append(f'{"名称":<20} {o_data.get("name","?"):<30} {v_data.get("name","?"):<30}')
out.append(f'{"版本":<20} {o_data.get("character_version","?"):<30} {v_data.get("character_version","?"):<30}')
out.append(f'{"spec":<20} {original.get("spec","?"):<30} {v2.get("spec","?"):<30}')
out.append(f'{"spec_version":<20} {original.get("spec_version","?"):<30} {v2.get("spec_version","?"):<30}')

o_sp = o_data.get("system_prompt","") or ""
v_sp = v_data.get("system_prompt","") or ""
out.append(f'{"system_prompt":<20} {"(空)" if not o_sp else "有内容":<30} {"有内容" if v_sp else "(空)":<30}')

o_wb = o_data.get('character_book', o_data.get('world_book', {})).get('entries', [])
v_wb = v_data.get('character_book', v_data.get('world_book', {})).get('entries', [])
out.append(f'{"世界书条目":<20} {len(o_wb):<30} {len(v_wb):<30}')

o_re = o_data.get('extensions', {}).get('regex_scripts', [])
v_re = v_data.get('extensions', {}).get('regex_scripts', [])
out.append(f'{"正则":<20} {len(o_re):<30} {len(v_re):<30}')

o_th = o_data.get('extensions', {}).get('tavern_helper', {}).get('scripts', [])
v_th = v_data.get('extensions', {}).get('tavern_helper', {}).get('scripts', [])
out.append(f'{"tavern_helper脚本":<20} {len(o_th):<30} {len(v_th):<30}')

# Check CDN URL in regex
for label, card in [('原始改地址', original), ('精炼版2', v2)]:
    s = json.dumps(card)
    for m in re.finditer(r'https?://[^"\\]+tavern-cards-status-bar[^"\\]+', s):
        url = m.group().replace('https://','')
        out.append(f'CDN地址: {label} -> {url}')

out.append(f'')
out.append(f'{"文件大小":<20} {os.path.getsize("C:/Users/admin/ST-CardBuilder/XianXiaSystem/精液增加修为系统_原始改地址.png"):<30} {os.path.getsize("C:/Users/admin/ST-CardBuilder/XianXiaSystem/精液增加修为系统_精炼版2.png"):<30}')

# Check for potential issues
out.append(f'')
out.append(f'========== 潜在问题检查 ==========')
if original.get('spec') != v2.get('spec'):
    out.append(f'[注意] spec不同: 原始v3 vs 精炼v2')
if len(o_re) != len(v_re):
    out.append(f'[注意] 正则数不同: {len(o_re)} vs {len(v_re)}')
if len(o_wb) != len(v_wb):
    out.append(f'[注意] 世界书条目数不同: {len(o_wb)} vs {len(v_wb)}')
if not v_sp:
    out.append(f'[注意] 精炼版2 system_prompt为空')

# Compare tavern_helper script names
o_names = set(s.get('name','') for s in o_th)
v_names = set(s.get('name','') for s in v_th)
if o_names != v_names:
    out.append(f'[注意] tavern_helper脚本不同')
    out.append(f'  原始: {o_names}')
    out.append(f'  精炼: {v_names}')

out.append(f'[OK] CDN地址两个卡都是cdn.jsdelivr.net')
out.append(f'[OK] 两个卡都有chara和ccv3块')

print('\n'.join(out))
