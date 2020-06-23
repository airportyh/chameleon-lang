define i32 @main() {
  %a = alloca i32
  store i32 10, i32* %a
  %tmp1 = load i32, i32* %a
  %tmp2 = icmp sge i32 %tmp1, 6
  br i1 %tmp2, label %if_true, label %if_exit
  if_true:
  %x = alloca i32
  store i32 4, i32* %x
  %tmp3 = call i32 @putchar (i32 65)
  br label %if_exit
  if_exit:
  %tmp4 = call i32 @putchar (i32 66)
  ret i32 0
}

declare i32 @putchar(i32)
declare i32 @getchar()