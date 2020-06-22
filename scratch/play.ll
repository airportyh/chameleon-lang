; ModuleID = '<stdin>'
source_filename = "play.c"
target datalayout = "e-m:o-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
target triple = "x86_64-apple-macosx10.13.0"

%struct.CharNode = type { i8, %struct.CharNode* }

@__const.main.message1 = private unnamed_addr constant [512 x i8] c"Hello, world!\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00", align 16

; Function Attrs: noinline nounwind optnone ssp uwtable
define %struct.CharNode* @makeCharNode(i8 signext %0, %struct.CharNode* %1) #0 {
  %3 = alloca i8, align 1
  %4 = alloca %struct.CharNode*, align 8
  %5 = alloca %struct.CharNode*, align 8
  store i8 %0, i8* %3, align 1
  store %struct.CharNode* %1, %struct.CharNode** %4, align 8
  %6 = call i8* @malloc(i64 16) #4
  %7 = bitcast i8* %6 to %struct.CharNode*
  store %struct.CharNode* %7, %struct.CharNode** %5, align 8
  %8 = load i8, i8* %3, align 1
  %9 = load %struct.CharNode*, %struct.CharNode** %5, align 8
  %10 = getelementptr inbounds %struct.CharNode, %struct.CharNode* %9, i32 0, i32 0
  store i8 %8, i8* %10, align 8
  %11 = load %struct.CharNode*, %struct.CharNode** %4, align 8
  %12 = load %struct.CharNode*, %struct.CharNode** %5, align 8
  %13 = getelementptr inbounds %struct.CharNode, %struct.CharNode* %12, i32 0, i32 1
  store %struct.CharNode* %11, %struct.CharNode** %13, align 8
  %14 = load %struct.CharNode*, %struct.CharNode** %5, align 8
  ret %struct.CharNode* %14
}

; Function Attrs: allocsize(0)
declare i8* @malloc(i64) #1

; Function Attrs: noinline nounwind optnone ssp uwtable
define void @printChars(%struct.CharNode* %0) #0 {
  %2 = alloca %struct.CharNode*, align 8
  store %struct.CharNode* %0, %struct.CharNode** %2, align 8
  ret void
}

; Function Attrs: noinline nounwind optnone ssp uwtable
define i32 @main() #0 {
  %1 = alloca i32, align 4
  %2 = alloca [512 x i8], align 16
  %3 = alloca i8*, align 8
  %4 = alloca i32, align 4
  %5 = alloca i32, align 4
  %6 = alloca %struct.CharNode*, align 8
  store i32 0, i32* %1, align 4
  %7 = bitcast [512 x i8]* %2 to i8*
  call void @llvm.memcpy.p0i8.p0i8.i64(i8* align 16 %7, i8* align 16 getelementptr inbounds ([512 x i8], [512 x i8]* @__const.main.message1, i32 0, i32 0), i64 512, i1 false)
  %8 = getelementptr inbounds [512 x i8], [512 x i8]* %2, i64 0, i64 0
  %9 = call i64 @strlen(i8* %8)
  %10 = trunc i64 %9 to i32
  store i32 %10, i32* %4, align 4
  %11 = load i32, i32* %4, align 4
  %12 = sext i32 %11 to i64
  %13 = mul i64 1, %12
  %14 = call i8* @malloc(i64 %13) #4
  store i8* %14, i8** %3, align 8
  %15 = load i32, i32* %4, align 4
  store i32 %15, i32* %5, align 4
  br label %16

16:                                               ; preds = %30, %0
  %17 = load i32, i32* %5, align 4
  %18 = icmp sge i32 %17, 0
  br i1 %18, label %19, label %33

19:                                               ; preds = %16
  %20 = load i32, i32* %4, align 4
  %21 = load i32, i32* %5, align 4
  %22 = sub nsw i32 %20, %21
  %23 = sext i32 %22 to i64
  %24 = getelementptr inbounds [512 x i8], [512 x i8]* %2, i64 0, i64 %23
  %25 = load i8, i8* %24, align 1
  %26 = load i8*, i8** %3, align 8
  %27 = load i32, i32* %5, align 4
  %28 = sext i32 %27 to i64
  %29 = getelementptr inbounds i8, i8* %26, i64 %28
  store i8 %25, i8* %29, align 1
  br label %30

30:                                               ; preds = %19
  %31 = load i32, i32* %5, align 4
  %32 = add nsw i32 %31, -1
  store i32 %32, i32* %5, align 4
  br label %16

33:                                               ; preds = %16
  %34 = call %struct.CharNode* @makeCharNode(i8 signext 33, %struct.CharNode* null)
  %35 = call %struct.CharNode* @makeCharNode(i8 signext 100, %struct.CharNode* %34)
  %36 = call %struct.CharNode* @makeCharNode(i8 signext 108, %struct.CharNode* %35)
  %37 = call %struct.CharNode* @makeCharNode(i8 signext 114, %struct.CharNode* %36)
  %38 = call %struct.CharNode* @makeCharNode(i8 signext 111, %struct.CharNode* %37)
  %39 = call %struct.CharNode* @makeCharNode(i8 signext 119, %struct.CharNode* %38)
  %40 = call %struct.CharNode* @makeCharNode(i8 signext 32, %struct.CharNode* %39)
  %41 = call %struct.CharNode* @makeCharNode(i8 signext 111, %struct.CharNode* %40)
  %42 = call %struct.CharNode* @makeCharNode(i8 signext 108, %struct.CharNode* %41)
  %43 = call %struct.CharNode* @makeCharNode(i8 signext 108, %struct.CharNode* %42)
  %44 = call %struct.CharNode* @makeCharNode(i8 signext 101, %struct.CharNode* %43)
  %45 = call %struct.CharNode* @makeCharNode(i8 signext 72, %struct.CharNode* %44)
  store %struct.CharNode* %45, %struct.CharNode** %6, align 8
  %46 = load i32, i32* %1, align 4
  ret i32 %46
}

; Function Attrs: argmemonly nounwind willreturn
declare void @llvm.memcpy.p0i8.p0i8.i64(i8* noalias nocapture writeonly, i8* noalias nocapture readonly, i64, i1 immarg) #2

declare i64 @strlen(i8*) #3

attributes #0 = { noinline nounwind optnone ssp uwtable "correctly-rounded-divide-sqrt-fp-math"="false" "disable-tail-calls"="false" "frame-pointer"="all" "less-precise-fpmad"="false" "min-legal-vector-width"="0" "no-infs-fp-math"="false" "no-jump-tables"="false" "no-nans-fp-math"="false" "no-signed-zeros-fp-math"="false" "no-trapping-math"="false" "stack-protector-buffer-size"="8" "target-cpu"="penryn" "target-features"="+cx16,+cx8,+fxsr,+mmx,+sahf,+sse,+sse2,+sse3,+sse4.1,+ssse3,+x87" "unsafe-fp-math"="false" "use-soft-float"="false" }
attributes #1 = { allocsize(0) "correctly-rounded-divide-sqrt-fp-math"="false" "disable-tail-calls"="false" "frame-pointer"="all" "less-precise-fpmad"="false" "no-infs-fp-math"="false" "no-nans-fp-math"="false" "no-signed-zeros-fp-math"="false" "no-trapping-math"="false" "stack-protector-buffer-size"="8" "target-cpu"="penryn" "target-features"="+cx16,+cx8,+fxsr,+mmx,+sahf,+sse,+sse2,+sse3,+sse4.1,+ssse3,+x87" "unsafe-fp-math"="false" "use-soft-float"="false" }
attributes #2 = { argmemonly nounwind willreturn }
attributes #3 = { "correctly-rounded-divide-sqrt-fp-math"="false" "disable-tail-calls"="false" "frame-pointer"="all" "less-precise-fpmad"="false" "no-infs-fp-math"="false" "no-nans-fp-math"="false" "no-signed-zeros-fp-math"="false" "no-trapping-math"="false" "stack-protector-buffer-size"="8" "target-cpu"="penryn" "target-features"="+cx16,+cx8,+fxsr,+mmx,+sahf,+sse,+sse2,+sse3,+sse4.1,+ssse3,+x87" "unsafe-fp-math"="false" "use-soft-float"="false" }
attributes #4 = { allocsize(0) }

!llvm.module.flags = !{!0, !1}
!llvm.ident = !{!2}

!0 = !{i32 1, !"wchar_size", i32 4}
!1 = !{i32 7, !"PIC Level", i32 2}
!2 = !{!"clang version 10.0.0 "}
