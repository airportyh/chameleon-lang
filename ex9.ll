define i32 @main() {
  %x = alloca i32
  store i32 65, i32* %x
  br label %loop_top3
  
  loop_top3:
  %tmp1 = load i32, i32* %x
  %tmp2 = icmp slt i32 %tmp1, 91
  br i1 %tmp2, label %loop_body3, label %loop_exit3
  
  loop_body3:
  %y = alloca i32
  store i32 48, i32* %y
  br label %loop_top6
  
  loop_top6:
  %tmp4 = load i32, i32* %y
  %tmp5 = icmp sle i32 %tmp4, 57
  br i1 %tmp5, label %loop_body6, label %loop_exit6
  
  loop_body6:
  %tmp7 = load i32, i32* %x
  %tmp8 = call i32 @putchar (i32 %tmp7)
  %tmp9 = load i32, i32* %y
  %tmp10 = call i32 @putchar (i32 %tmp9)
  %tmp11 = load i32, i32* %y
  %tmp12 = add i32 %tmp11, 1
  store i32 %tmp12, i32* %y
  br label %loop_top6
  
  loop_exit6:
  %tmp13 = call i32 @putchar (i32 10)
  %tmp14 = load i32, i32* %x
  %tmp15 = add i32 %tmp14, 1
  store i32 %tmp15, i32* %x
  br label %loop_top3
  
  loop_exit3:
  %tmp16 = call i32 @putchar (i32 10)
  ret i32 0
}

declare i32 @putchar(i32)
declare i32 @getchar()