%struct.User = type { i32, i32 }

define i32 @main() {
  %user = alloca %struct.User
  %tmp1 = getelementptr inbounds %struct.User, %struct.User* %user, i32 0, i32 0
  store i32 84, i32* %tmp1
  %tmp2 = getelementptr inbounds %struct.User, %struct.User* %user, i32 0, i32 1
  store i32 72, i32* %tmp2
  %user2 = alloca %struct.User
  %tmp3 = getelementptr inbounds %struct.User, %struct.User* %user2, i32 0, i32 0
  store i32 84, i32* %tmp3
  %tmp4 = getelementptr inbounds %struct.User, %struct.User* %user2, i32 0, i32 1
  store i32 72, i32* %tmp4
  %tmp5 = load %struct.User, %struct.User* %user
  %tmp6 = call undefined @printUser (%struct.User %tmp5)
  ret i32 0
}

define i32 @printUser(%struct.User %_user) {
  %user = alloca %struct.User
  store %struct.User %_user, %struct.User* %user
  %tmp7 = getelementptr inbounds %struct.User, %struct.User* %user, i32 0, i32 0
  %tmp8 = load i32, i32* %tmp7
  %tmp9 = call i32 @putchar (i32 %tmp8)
  %tmp10 = getelementptr inbounds %struct.User, %struct.User* %user, i32 0, i32 1
  %tmp11 = load i32, i32* %tmp10
  %tmp12 = call i32 @putchar (i32 %tmp11)
  %tmp13 = call i32 @putchar (i32 10)
}

declare i32 @putchar(i32)
declare i32 @getchar()
declare i8* @malloc(i32)
declare void @free(i8*)