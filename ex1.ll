define i32 @main() {
  %tmp1 = add i32 60, 7
  %a = alloca i32
  store i32 %tmp1, i32* %a
  %tmp2 = load i32, i32* %a
  %tmp3 = add i32 %tmp2, 4
  %b = alloca i32
  store i32 %tmp3, i32* %b
  %tmp4 = load i32, i32* %a
  %tmp5 = call i32 @putchar (i32 %tmp4)
  %tmp6 = load i32, i32* %b
  %tmp7 = call i32 @putchar (i32 %tmp6)
  %tmp8 = call i32 @putchar (i32 10)
  ret i32 0
}

declare i32 @putchar(i32)