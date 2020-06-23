define i32 @main() {
  %x = alloca double
  store double 5.0, double* %x
  %y = alloca double
  store double 6.5, double* %y
  %tmp1 = load double, double* %x
  %tmp2 = load double, double* %y
  %tmp3 = fadd double 10.0, 4.5
  %tmp4 = fmul double %tmp2, %tmp3
  %tmp5 = fadd double %tmp1, %tmp4
  %z = alloca double
  store double %tmp5, double* %z
  %tmp6 = load double, double* %z
  %tmp7 = fptosi double %tmp6 to i32
  %tmp8 = call i32 @putchar (i32 %tmp7)
  ret i32 0
}

declare i32 @putchar(i32)
declare i32 @getchar()