%struct.Book = type { i32, double }

define i32 @main() {
    %temp1 = alloca %struct.Book
    %book = alloca %struct.Book*
    store %struct.Book* %temp1, %struct.Book** %book
    %temp2 = load %struct.Book*, %struct.Book** %book
    %1 = getelementptr inbounds %struct.Book, %struct.Book* %temp2, i32 0, i32 0
    store i32 65, i32* %1
    %2 = getelementptr inbounds %struct.Book, %struct.Book* %temp2, i32 0, i32 1
    store double 5.5, double* %2
    %3 = load i32, i32* %1
    call i32 @putchar(i32 %3)
    ret i32 0
}

declare i32 @putchar(i32)