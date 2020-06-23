define i32 @main() {
  %x = alloca i32
  store i32 65, i32* %x
  br label %loop_top3
  
  loop_top3:
  %tmp1 = load i32, i32* %x
  %tmp2 = icmp slt i32 %tmp1, 91
  br i1 %tmp2, label %loop_body3, label %loop_exit3
  
  loop_body3:
  %tmp4 = load i32, i32* %x
  %tmp5 = call i32 @putchar (i32 %tmp4)
  %tmp6 = call i32 @putchar (i32 10)
  %tmp7 = load i32, i32* %x
  %tmp8 = add i32 %tmp7, 1
  store i32 %tmp8, i32* %x
  br label %loop_top3
  
  loop_exit3:
  %tmp9 = call i32 @putchar (i32 10)
  ret i32 0
}

declare i32 @putchar(i32)
declare i32 @getchar()