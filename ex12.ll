%struct.User = type { i8, i8 }

define i32 @main() {
  %user = alloca %struct.User
  %tmp1 = getelementptr inbounds %struct.User, %struct.User* %user, i32 0, i32 0
  store i8 84, i8* %tmp1
  %tmp2 = getelementptr inbounds %struct.User, %struct.User* %user, i32 0, i32 1
  store i8 72, i8* %tmp2
  %user2 = alloca %struct.User
  %tmp3 = getelementptr inbounds %struct.User, %struct.User* %user2, i32 0, i32 0
  store i8 77, i8* %tmp3
  %tmp4 = getelementptr inbounds %struct.User, %struct.User* %user2, i32 0, i32 1
  store i8 72, i8* %tmp4
  %tmp5 = getelementptr inbounds %struct.User, %struct.User* %user, i32 0, i32 0
  %tmp6 = load i8, i8* %tmp5
  %tmp7 = zext i8 %tmp6 to i32
  %tmp8 = call i32 @putchar (i32 %tmp7)
  %tmp9 = getelementptr inbounds %struct.User, %struct.User* %user, i32 0, i32 1
  %tmp10 = load i8, i8* %tmp9
  %tmp11 = zext i8 %tmp10 to i32
  %tmp12 = call i32 @putchar (i32 %tmp11)
  %tmp13 = call i32 @putchar (i32 10)
  %tmp14 = getelementptr inbounds %struct.User, %struct.User* %user2, i32 0, i32 0
  %tmp15 = load i8, i8* %tmp14
  %tmp16 = zext i8 %tmp15 to i32
  %tmp17 = call i32 @putchar (i32 %tmp16)
  %tmp18 = getelementptr inbounds %struct.User, %struct.User* %user2, i32 0, i32 1
  %tmp19 = load i8, i8* %tmp18
  %tmp20 = zext i8 %tmp19 to i32
  %tmp21 = call i32 @putchar (i32 %tmp20)
  %tmp22 = call i32 @putchar (i32 10)
  ret i32 0
}

declare i32 @putchar(i32)
declare i32 @getchar()