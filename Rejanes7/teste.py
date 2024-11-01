import csv

# Dados das reservas
reservas = [
    {'customer_name': 'João Silva', 'table_number': 5, 'status': 'confirmed', 'reservation_time': '2024-10-18 19:00:00'},
    {'customer_name': 'Maria Costa', 'table_number': 2, 'status': 'pending', 'reservation_time': '2024-10-18 18:30:00'},
    {'customer_name': 'Pedro Souza', 'table_number': 8, 'status': 'confirmed', 'reservation_time': '2024-10-18 20:00:00'},
    {'customer_name': 'Ana Pereira', 'table_number': 10, 'status': 'canceled', 'reservation_time': '2024-10-18 21:00:00'},
    {'customer_name': 'Carlos Lima', 'table_number': 4, 'status': 'confirmed', 'reservation_time': '2024-10-18 19:45:00'}
]

# Nome do arquivo CSV
csv_file = 'reservas.csv'

# Criando o arquivo CSV e escrevendo os dados
with open(csv_file, mode='w', newline='', encoding='utf-8') as file:
    writer = csv.DictWriter(file, fieldnames=reservas[0].keys())
    
    # Escrevendo o cabeçalho
    writer.writeheader()
    
    # Escrevendo as linhas de dados
    for reserva in reservas:
        writer.writerow(reserva)

print(f'Arquivo {csv_file} criado com sucesso!')