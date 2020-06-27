%struct.User = type { i32, i32 }

define i32 @main() {
  %tmp1 = alloca %struct.User
  %tmp2 = getelementptr inbounds %struct.User, %struct.User* %tmp1, i32 0, i32 0
  store i32 84, i32* %tmp2
  %tmp3 = getelementptr inbounds %struct.User, %struct.User* %tmp1, i32 0, i32 1
  store i32 72, i32* %tmp3
  %user = alloca %struct.User*
  store %struct.User* %tmp1, %struct.User** %user
  %tmp4 = alloca %struct.User
  %tmp5 = getelementptr inbounds %struct.User, %struct.User* %tmp4, i32 0, i32 0
  store i32 77, i32* %tmp5
  %tmp6 = getelementptr inbounds %struct.User, %struct.User* %tmp4, i32 0, i32 1
  store i32 72, i32* %tmp6
  %user2 = alloca %struct.User*
  store %struct.User* %tmp4, %struct.User** %user2
  %tmp7 = load %struct.User*, %struct.User** %user
  %tmp8 = getelementptr inbounds %struct.User, %struct.User* %tmp7, i32 0, i32 0
  %tmp9 = load i32, i32* %tmp8
  %tmp10 = call i32 @putchar (i32 %tmp9)
  %tmp11 = load %struct.User*, %struct.User** %user
  %tmp12 = getelementptr inbounds %struct.User, %struct.User* %tmp11, i32 0, i32 1
  %tmp13 = load i32, i32* %tmp12
  %tmp14 = call i32 @putchar (i32 %tmp13)
  %tmp15 = call i32 @putchar (i32 10)
  %tmp16 = load %struct.User*, %struct.User** %user2
  %tmp17 = getelementptr inbounds %struct.User, %struct.User* %tmp16, i32 0, i32 0
  %tmp18 = load i32, i32* %tmp17
  %tmp19 = call i32 @putchar (i32 %tmp18)
  %tmp20 = load %struct.User*, %struct.User** %user2
  %tmp21 = getelementptr inbounds %struct.User, %struct.User* %tmp20, i32 0, i32 1
  %tmp22 = load i32, i32* %tmp21
  %tmp23 = call i32 @putchar (i32 %tmp22)
  %tmp24 = call i32 @putchar (i32 10)
  ret i32 0
}

declare i32 @putchar(i32)
declare i32 @getchar()
declare i8* @malloc(i32)
declare void @free(i8*)