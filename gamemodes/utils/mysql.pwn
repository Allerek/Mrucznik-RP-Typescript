new MySQL:SQL_ID;

stock MySQL_Init(){
    mysql_log();
    SQL_ID = mysql_connect_file("mysql.ini");
    if(SQL_ID == MYSQL_INVALID_HANDLE || mysql_errno(SQL_ID) != 0){
        print("[MySQL - BLAD] Brak polaczenia z baza danych...");
        SendRconCommand("exit");
        return 0;
    }
    print("[MySQL] Nawiazano polaczenie z baza danych!");
    return 1;
}