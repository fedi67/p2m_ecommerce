import sys

def sanitize_logs(infile, outfile):
    try:
        data = open(infile, 'rb').read()
        text = ""
        if data.startswith(b'\xff\xfe') or data.startswith(b'\xfe\xff'):
            text = data.decode('utf-16', errors='ignore')
        else:
            text = data.decode('utf-8', errors='ignore')
        
        with open(outfile, 'w', encoding='ascii', errors='ignore') as f:
            for line in text.splitlines():
                if '[WARN]' in line or '[ERR]' in line or 'Exception' in line:
                    f.write(line + '\n')
        print(f"Sanitized logs written to {outfile}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    sanitize_logs('server.log', 'server_clean.txt')
