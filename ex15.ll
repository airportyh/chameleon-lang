%struct.LinkedList = type { i32, %struct.LinkedList* }

define i32 @main() {
  %tmp1 = call i8* @malloc(i32 12)
  %tmp2 = bitcast i8* %tmp1 to %struct.LinkedList*
  %tmp3 = getelementptr inbounds %struct.LinkedList, %struct.LinkedList* %tmp2, i32 0, i32 0
  store i32 65, i32* %tmp3
  %tmp4 = call i8* @malloc(i32 12)
  %tmp5 = bitcast i8* %tmp4 to %struct.LinkedList*
  %tmp6 = getelementptr inbounds %struct.LinkedList, %struct.LinkedList* %tmp5, i32 0, i32 0
  store i32 66, i32* %tmp6
  %tmp7 = call i8* @malloc(i32 12)
  %tmp8 = bitcast i8* %tmp7 to %struct.LinkedList*
  %tmp9 = getelementptr inbounds %struct.LinkedList, %struct.LinkedList* %tmp8, i32 0, i32 0
  store i32 67, i32* %tmp9
  %tmp10 = call i8* @malloc(i32 12)
  %tmp11 = bitcast i8* %tmp10 to %struct.LinkedList*
  %tmp12 = getelementptr inbounds %struct.LinkedList, %struct.LinkedList* %tmp11, i32 0, i32 0
  store i32 68, i32* %tmp12
  %tmp13 = getelementptr inbounds %struct.LinkedList, %struct.LinkedList* %tmp11, i32 0, i32 1
  store %struct.LinkedList* null, %struct.LinkedList** %tmp13
  %tmp14 = getelementptr inbounds %struct.LinkedList, %struct.LinkedList* %tmp8, i32 0, i32 1
  store %struct.LinkedList* %tmp11, %struct.LinkedList** %tmp14
  %tmp15 = getelementptr inbounds %struct.LinkedList, %struct.LinkedList* %tmp5, i32 0, i32 1
  store %struct.LinkedList* %tmp8, %struct.LinkedList** %tmp15
  %tmp16 = getelementptr inbounds %struct.LinkedList, %struct.LinkedList* %tmp2, i32 0, i32 1
  store %struct.LinkedList* %tmp5, %struct.LinkedList** %tmp16
  %list = alloca %struct.LinkedList*
  store %struct.LinkedList* %tmp2, %struct.LinkedList** %list
  %tmp17 = load %struct.LinkedList*, %struct.LinkedList** %list
  %current = alloca %struct.LinkedList*
  store %struct.LinkedList* %tmp17, %struct.LinkedList** %current
  br label %loop_top20
  
  loop_top20:
  %tmp18 = load %struct.LinkedList*, %struct.LinkedList** %current
  %tmp19 = icmp ne %struct.LinkedList* %tmp18, null
  br i1 %tmp19, label %loop_body20, label %loop_exit20
  
  loop_body20:
  %tmp21 = load %struct.LinkedList*, %struct.LinkedList** %current
  %tmp22 = getelementptr inbounds %struct.LinkedList, %struct.LinkedList* %tmp21, i32 0, i32 0
  %tmp23 = load i32, i32* %tmp22
  %tmp24 = call i32 @putchar (i32 %tmp23)
  %tmp25 = load %struct.LinkedList*, %struct.LinkedList** %current
  %tmp26 = getelementptr inbounds %struct.LinkedList, %struct.LinkedList* %tmp25, i32 0, i32 1
  %tmp27 = load %struct.LinkedList*, %struct.LinkedList** %tmp26
  store %struct.LinkedList* %tmp27, %struct.LinkedList** %current
  br label %loop_top20
  
  loop_exit20:
  %tmp28 = call i32 @putchar (i32 10)
  ret i32 10
}

declare i32 @putchar(i32)
declare i32 @getchar()
declare i8* @malloc(i32)
declare void @free(i8*)