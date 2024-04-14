import psycopg2
from psycopg2 import OperationalError
# 測試資料庫連線
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



def import_data_into_station(host, database, user, password, port="5432", file_path='station_data.txt'):
    try:
        # 连接到 PostgreSQL 数据库
        conn = psycopg2.connect(
            host=host,
            port=port,
            database=database,
            user=user,
            password=password
        )
        cur = conn.cursor()
        print("Successfully connected to the database")
        
        # 打开并读取文件
        with open(file_path, 'r') as file:
            for line in file:
                # 解析行
                coordinate, station_name, avg_data, error = line.strip().split(',')
                # 处理coordinate格式，转换为PostGIS支持的格式
                lon, lat = coordinate[1:-1].split(', ')  # 移除括号并分割经纬度
                
                # 构建插入语句，注意这里使用了ST_PointFromText函数来创建几何点
                query = """
                INSERT INTO station (coordinate, station_name, avg_data, error)
                VALUES (ST_PointFromText('POINT(%s %s)', 4326), %s, %s, %s);
                """
                # 执行插入操作
                cur.execute(query, (lon, lat, station_name, avg_data, error))

        # 提交事务
        conn.commit()
        print("Data imported successfully.")
    except OperationalError as e:
        print(f"The error '{e}' occurred")
    except Exception as ex:
        print(f"An error occurred: {ex}")
    finally:
        # 确保在结束前关闭连接
        if conn:
            cur.close()
            conn.close()
            print("Database connection closed.")

# 更改test.txt為自己的檔名
def import_data_into_deformation(host, database, user, password, port="5432", file_path='test.txt'):
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

            with open(file_path, 'r') as file:
                for line in file:
                    station_id, timestamp, data = line.strip().split(',')
                    
                    query = """
                    INSERT INTO deformation (station_id, timestamp, data)
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
import_data_into_station(HOST, DATABASE, USER, PASSWORD)
import_data_into_deformation(HOST, DATABASE, USER, PASSWORD)



