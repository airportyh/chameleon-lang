declare i8* @malloc(i32)
declare void @free(i8*)
declare i32 @putchar(i32)

%struct.User = type { i32, i32 }

define i32 @main() {
    %tmp1 = call i8* @malloc(i32 8)
    %tmp1b = bitcast i8* %tmp1 to %struct.User*
    %tmp2 = getelementptr %struct.User, %struct.User* %user, i32 0, i32 0
    %first = load i32, i32* %tmp2
    %tmp3 = getelementptr %struct.User, %struct.User* %user, i32 0, i32 1
    %last = load i32, i32* %tmp3
    call i32 @putchar(i32 %first)
    call i32 @putchar(i32 %last)
    call i32 @putchar(i32 10)
    %tmp4 = bitcast %struct.User* %user to i8*
    call void @free(i8* %tmp4)
    ret i32 0
}