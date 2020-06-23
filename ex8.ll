define i32 @main() {
  %a = alloca i32
  store i32 24, i32* %a
  %tmp1 = load i32, i32* %a
  %tmp2 = icmp sge i32 %tmp1, 20
  br i1 %tmp2, label %if_true3, label %if_false3
  
  if_true3:
  %tmp4 = call i32 @putchar (i32 68)
  br label %if_exit3
  
  if_false3:
  %tmp5 = load i32, i32* %a
  %tmp6 = icmp eq i32 %tmp5, 10
  br i1 %tmp6, label %if_true7, label %if_false7
  
  if_true7:
  %tmp8 = call i32 @putchar (i32 67)
  br label %if_exit7
  
  if_false7:
  %tmp9 = call i32 @putchar (i32 66)
  br label %if_exit7
  
  if_exit7:
  br label %if_exit3
  
  if_exit3:
  %tmp10 = call i32 @putchar (i32 10)
ret i32 0
}

declare i32 @putchar(i32)
declare i32 @getchar()