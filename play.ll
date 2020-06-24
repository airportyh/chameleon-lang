; ModuleID = '<stdin>'
source_filename = "play.c"
target datalayout = "e-m:o-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
target triple = "x86_64-apple-macosx10.13.0"

%struct.User = type { i8*, i8* }

@.str = private unnamed_addr constant [7 x i8] c"%s, %s\00", align 1
@.str.1 = private unnamed_addr constant [10 x i8] c"airportyh\00", align 1
@.str.2 = private unnamed_addr constant [20 x i8] c"airportyh@gmail.com\00", align 1

; Function Attrs: noinline nounwind optnone ssp uwtable
define void @printUser(%struct.User* %0) #0 {
  %2 = alloca %struct.User*, align 8
  store %struct.User* %0, %struct.User** %2, align 8
  %3 = load %struct.User*, %struct.User** %2, align 8
  %4 = getelementptr inbounds %struct.User, %struct.User* %3, i32 0, i32 0
  %5 = load i8*, i8** %4, align 8
  %6 = load %struct.User*, %struct.User** %2, align 8
  %7 = getelementptr inbounds %struct.User, %struct.User* %6, i32 0, i32 1
  %8 = load i8*, i8** %7, align 8
  %9 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @.str, i64 0, i64 0), i8* %5, i8* %8)
  ret void
}

declare i32 @printf(i8*, ...) #1

; Function Attrs: noinline nounwind optnone ssp uwtable
define { i8*, i8* } @createUser(i8* %0, i8* %1) #0 {
  %3 = alloca %struct.User, align 8
  %4 = alloca i8*, align 8
  %5 = alloca i8*, align 8
  store i8* %0, i8** %4, align 8
  store i8* %1, i8** %5, align 8
  %6 = load i8*, i8** %4, align 8
  %7 = getelementptr inbounds %struct.User, %struct.User* %3, i32 0, i32 0
  store i8* %6, i8** %7, align 8
  %8 = load i8*, i8** %5, align 8
  %9 = getelementptr inbounds %struct.User, %struct.User* %3, i32 0, i32 1
  store i8* %8, i8** %9, align 8
  %10 = bitcast %struct.User* %3 to { i8*, i8* }*
  %11 = load { i8*, i8* }, { i8*, i8* }* %10, align 8
  ret { i8*, i8* } %11
}

; Function Attrs: noinline nounwind optnone ssp uwtable
define i32 @main() #0 {
  %1 = alloca %struct.User, align 8
  %2 = call { i8*, i8* } @createUser(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @.str.1, i64 0, i64 0), i8* getelementptr inbounds ([20 x i8], [20 x i8]* @.str.2, i64 0, i64 0))
  %3 = bitcast %struct.User* %1 to { i8*, i8* }*
  %4 = getelementptr inbounds { i8*, i8* }, { i8*, i8* }* %3, i32 0, i32 0
  %5 = extractvalue { i8*, i8* } %2, 0
  store i8* %5, i8** %4, align 8
  %6 = getelementptr inbounds { i8*, i8* }, { i8*, i8* }* %3, i32 0, i32 1
  %7 = extractvalue { i8*, i8* } %2, 1
  store i8* %7, i8** %6, align 8
  call void @printUser(%struct.User* %1)
  ret i32 0
}

attributes #0 = { noinline nounwind optnone ssp uwtable "correctly-rounded-divide-sqrt-fp-math"="false" "disable-tail-calls"="false" "frame-pointer"="all" "less-precise-fpmad"="false" "min-legal-vector-width"="0" "no-infs-fp-math"="false" "no-jump-tables"="false" "no-nans-fp-math"="false" "no-signed-zeros-fp-math"="false" "no-trapping-math"="false" "stack-protector-buffer-size"="8" "target-cpu"="penryn" "target-features"="+cx16,+cx8,+fxsr,+mmx,+sahf,+sse,+sse2,+sse3,+sse4.1,+ssse3,+x87" "unsafe-fp-math"="false" "use-soft-float"="false" }
attributes #1 = { "correctly-rounded-divide-sqrt-fp-math"="false" "disable-tail-calls"="false" "frame-pointer"="all" "less-precise-fpmad"="false" "no-infs-fp-math"="false" "no-nans-fp-math"="false" "no-signed-zeros-fp-math"="false" "no-trapping-math"="false" "stack-protector-buffer-size"="8" "target-cpu"="penryn" "target-features"="+cx16,+cx8,+fxsr,+mmx,+sahf,+sse,+sse2,+sse3,+sse4.1,+ssse3,+x87" "unsafe-fp-math"="false" "use-soft-float"="false" }

!llvm.module.flags = !{!0, !1}
!llvm.ident = !{!2}

!0 = !{i32 1, !"wchar_size", i32 4}
!1 = !{i32 7, !"PIC Level", i32 2}
!2 = !{!"clang version 10.0.0 "}
