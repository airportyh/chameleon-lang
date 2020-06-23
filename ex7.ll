define i32 @main() {
  %a = alloca i32
  store i32 10, i32* %a
  %tmp1 = load i32, i32* %a
  %tmp2 = icmp sgt i32 %tmp1, 6
  br i1 %tmp2, label %if_true3, label %if_false3
  
  if_true3:
  %x = alloca i32
  store i32 4, i32* %x
  %tmp4 = call i32 @putchar (i32 65)
  br label %if_exit3
  
  if_false3:
  %tmp5 = call i32 @putchar (i32 67)
  br label %if_exit3
  
  if_exit3:
  %tmp6 = call i32 @putchar (i32 10)
  ret i32 0
}

declare i32 @putchar(i32)
declare i32 @getchar()