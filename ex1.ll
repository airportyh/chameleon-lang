define i32 @main() {
  %tmp1 = mul i32 6, 10
  %tmp2 = add i32 %tmp1, 5
  %tmp3 = zext i32 %tmp2 to i64
  %a = alloca i64
  store i64 %tmp3, i64* %a
  %tmp4 = load i64, i64* %a
  %tmp5 = sub i32 4, 2
  %tmp6 = zext i32 %tmp5 to i64
  %tmp7 = add i64 %tmp4, %tmp6
  %b = alloca i64
  store i64 %tmp7, i64* %b
  %tmp8 = load i64, i64* %b
  %tmp9 = zext i32 2 to i64
  %tmp10 = sub i64 %tmp8, %tmp9
  %tmp11 = load i64, i64* %a
  %tmp12 = zext i32 4 to i64
  %tmp13 = add i64 %tmp11, %tmp12
  %tmp14 = fptosi double 30.5 to i32
  %tmp15 = add i32 2, %tmp14
  %tmp16 = zext i32 %tmp15 to i64
  %tmp17 = sub i64 %tmp13, %tmp16
  %tmp18 = mul i64 %tmp10, %tmp17
  %c = alloca i64
  store i64 %tmp18, i64* %c
  %tmp19 = load i64, i64* %c
  %tmp20 = trunc i64 %tmp19 to i32
  %d = alloca i32
  store i32 %tmp20, i32* %d
  %tmp21 = sitofp i32 5 to float
  %f = alloca float
  store float %tmp21, float* %f
  %tmp22 = load float, float* %f
  %tmp23 = fpext float %tmp22 to double
  %tmp24 = sitofp i32 20 to double
  %tmp25 = fmul double 5.6, %tmp24
  %tmp26 = fadd double %tmp23, %tmp25
  %g = alloca double
  store double %tmp26, double* %g
  %tmp27 = load double, double* %g
  %tmp28 = sitofp i32 5 to double
  %tmp29 = fsub double %tmp27, %tmp28
  %h = alloca double
  store double %tmp29, double* %h
  %tmp30 = load i32, i32* %d
  %tmp31 = call i32 @putchar (i32 %tmp30)
  %tmp32 = load double, double* %h
  %tmp33 = fptosi double %tmp32 to i32
  %tmp34 = call i32 @putchar (i32 %tmp33)
  %tmp35 = call i32 @putchar (i32 10)
  ret i32 0
}

declare i32 @putchar(i32)
declare i32 @getchar()