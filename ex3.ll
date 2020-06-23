define i32 @add(i32 %_x, i32 %_y) {
  %x = alloca i32
  store i32 %_x, i32* %x
  %y = alloca i32
  store i32 %_y, i32* %y
  %tmp1 = load i32, i32* %x
  %tmp2 = load i32, i32* %y
  %tmp3 = add i32 %tmp1, %tmp2
  ret i32 %tmp3
}

define i32 @main() {
  %a = alloca i32
  store i32 5, i32* %a
  %b = alloca i32
  store i32 60, i32* %b
  %tmp4 = load i32, i32* %a
  %tmp5 = load i32, i32* %b
  %tmp6 = call i32 @add (i32 %tmp4, i32 %tmp5)
  %c = alloca i32
  store i32 %tmp6, i32* %c
  %tmp7 = load i32, i32* %c
  %tmp8 = call i32 @putchar (i32 %tmp7)
  ret i32 0
}

declare i32 @putchar(i32)
