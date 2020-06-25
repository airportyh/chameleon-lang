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
  ret i32 0
}

declare i32 @putchar(i32)
declare i32 @getchar()