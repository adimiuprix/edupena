import openpyxl

wb = openpyxl.load_workbook('eraport.xlsm', data_only=True)
sheet = wb['EDIT TP']

print("=== SHAPE OF EDIT TP ===")
for i, row in enumerate(sheet.iter_rows(min_row=1, max_row=20, min_col=1, max_col=15, values_only=True)):
    print(f"Row {i+1}: {[str(val)[:30] if val is not None else '' for val in row]}")
