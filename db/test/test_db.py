import psycopg2
from psycopg2 import OperationalError

def test_postgresql_connection(host, port, database, user, password):
    try:
        connection = psycopg2.connect(
            host=host,
            port=port,
            database=database,
            user=user,
            password=password
        )
        
        print("Successfully connected to the database")
        return True
    except OperationalError as e:
        print(f"The error '{e}' occurred")
        return False
    finally:
        if 'connection' in locals() and connection:
            connection.close()
            print("Database connection closed.")

def import_data_into_deformation(host, database, user, password, port="5432"):
    if test_postgresql_connection(host, port, database, user, password):
        try:
            conn = psycopg2.connect(
                host=host,
                port=port,
                database=database,
                user=user,
                password=password
            )
            cur = conn.cursor()
            
            with open('test.txt', 'r') as file:
                for line in file:
                    station_id, timestamp, data = line.strip().split(',')
                    
                    query = """
                    INSERT INTO test_deformation (station_id, timestamp, data)
                    VALUES (%s, %s, %s);
                    """
                    cur.execute(query, (station_id, timestamp, data))
            
            conn.commit()
            print("Data imported successfully.")
        except Exception as e:
            print(f"An error occurred: {e}")
        finally:
            if conn:
                cur.close()
                conn.close()
                print("Database connection closed.")

HOST = "localhost"
PORT = "5432"
DATABASE = "insar"
USER = "87MW8bmk"
PASSWORD = "u9XYxrWP"

import_data_into_deformation(HOST, DATABASE, USER, PASSWORD)



