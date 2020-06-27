%struct.LinkedList = type { i32, %struct.LinkedList* }

define %struct.LinkedList* @makeLL(i32 %_data, %struct.LinkedList* %_next) {
  %data = alloca i32
  store i32 %_data, i32* %data
  %next = alloca %struct.LinkedList*
  store %struct.LinkedList* %_next, %struct.LinkedList** %next
  %tmp1 = call i8* @malloc(i32 12)
  %tmp2 = bitcast i8* %tmp1 to %struct.LinkedList*
  %tmp3 = load i32, i32* %data
  %tmp4 = getelementptr inbounds %struct.LinkedList, %struct.LinkedList* %tmp2, i32 0, i32 0
  store i32 %tmp3, i32* %tmp4
  %tmp5 = load %struct.LinkedList*, %struct.LinkedList** %next
  %tmp6 = getelementptr inbounds %struct.LinkedList, %struct.LinkedList* %tmp2, i32 0, i32 1
  store %struct.LinkedList* %tmp5, %struct.LinkedList** %tmp6
  ret %struct.LinkedList* %tmp2
}

define i32 @main() {
  %tmp7 = call %struct.LinkedList* @makeLL (i32 68, %struct.LinkedList* null)
  %tmp8 = call %struct.LinkedList* @makeLL (i32 67, %struct.LinkedList* %tmp7)
  %tmp9 = call %struct.LinkedList* @makeLL (i32 66, %struct.LinkedList* %tmp8)
  %tmp10 = call %struct.LinkedList* @makeLL (i32 65, %struct.LinkedList* %tmp9)
  %list = alloca %struct.LinkedList*
  store %struct.LinkedList* %tmp10, %struct.LinkedList** %list
  %tmp11 = load %struct.LinkedList*, %struct.LinkedList** %list
  %current = alloca %struct.LinkedList*
  store %struct.LinkedList* %tmp11, %struct.LinkedList** %current
  br label %loop_top14
  
  loop_top14:
  %tmp12 = load %struct.LinkedList*, %struct.LinkedList** %current
  %tmp13 = icmp ne %struct.LinkedList* %tmp12, null
  br i1 %tmp13, label %loop_body14, label %loop_exit14
  
  loop_body14:
  %tmp15 = load %struct.LinkedList*, %struct.LinkedList** %current
  %tmp16 = getelementptr inbounds %struct.LinkedList, %struct.LinkedList* %tmp15, i32 0, i32 0
  %tmp17 = load i32, i32* %tmp16
  %tmp18 = call i32 @putchar (i32 %tmp17)
  %tmp19 = load %struct.LinkedList*, %struct.LinkedList** %current
  %tmp20 = getelementptr inbounds %struct.LinkedList, %struct.LinkedList* %tmp19, i32 0, i32 1
  %tmp21 = load %struct.LinkedList*, %struct.LinkedList** %tmp20
  store %struct.LinkedList* %tmp21, %struct.LinkedList** %current
  br label %loop_top14
  
  loop_exit14:
  %tmp22 = call i32 @putchar (i32 10)
  ret i32 0
}

declare i32 @putchar(i32)
declare i32 @getchar()
declare i8* @malloc(i32)
declare void @free(i8*)