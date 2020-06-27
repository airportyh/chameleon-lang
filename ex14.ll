%struct.User = type { i32, i32 }

define i32 @main() {
  %tmp1 = call i8* @malloc(i32 8)
  %tmp2 = bitcast i8* %tmp1 to %struct.User*
  %tmp3 = getelementptr inbounds %struct.User, %struct.User* %tmp2, i32 0, i32 0
  store i32 77, i32* %tmp3
  %tmp4 = getelementptr inbounds %struct.User, %struct.User* %tmp2, i32 0, i32 1
  store i32 72, i32* %tmp4
  %marty = alloca %struct.User*
  store %struct.User* %tmp2, %struct.User** %marty
  %tmp5 = load %struct.User*, %struct.User** %marty
  %tmp6 = getelementptr inbounds %struct.User, %struct.User* %tmp5, i32 0, i32 0
  %tmp7 = load i32, i32* %tmp6
  %tmp8 = call i32 @putchar (i32 %tmp7)
  %tmp9 = load %struct.User*, %struct.User** %marty
  %tmp10 = getelementptr inbounds %struct.User, %struct.User* %tmp9, i32 0, i32 1
  %tmp11 = load i32, i32* %tmp10
  %tmp12 = call i32 @putchar (i32 %tmp11)
  %tmp13 = call i32 @putchar (i32 10)
  %tmp14 = load %struct.User*, %struct.User** %marty
  %tmp15 = bitcast %struct.User* %tmp14 to i8*
  call void @free(i8* %tmp15)
  ret i32 0
}

declare i32 @putchar(i32)
declare i32 @getchar()
declare i8* @malloc(i32)
declare void @free(i8*)