declare i32 @putchar(i32)
declare i32 @getchar()
declare i8* @malloc(i32)
declare void @free(i8*)
%struct.LinkedList = type { i32, %struct.LinkedList* }

define %struct.LinkedList* @make_ll(i32 %_data, %struct.LinkedList* %_next) {
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

define i32 @free_ll(%struct.LinkedList* %_list) {
  %list = alloca %struct.LinkedList*
  store %struct.LinkedList* %_list, %struct.LinkedList** %list
  %tmp7 = load %struct.LinkedList*, %struct.LinkedList** %list
  %tmp8 = icmp ne %struct.LinkedList* %tmp7, null
  br i1 %tmp8, label %if_true9, label %if_exit9
  
  if_true9:
  %tmp10 = load %struct.LinkedList*, %struct.LinkedList** %list
  %tmp11 = getelementptr inbounds %struct.LinkedList, %struct.LinkedList* %tmp10, i32 0, i32 1
  %tmp12 = load %struct.LinkedList*, %struct.LinkedList** %tmp11
  %tmp13 = call i32 @free_ll (%struct.LinkedList* %tmp12)
  %tmp14 = load %struct.LinkedList*, %struct.LinkedList** %list
  %tmp15 = bitcast %struct.LinkedList* %tmp14 to i8*
  call void @free(i8* %tmp15)
  br label %if_exit9
  
  if_exit9:
  ret i32 0
}

define i32 @print_int(i32 %_num) {
  %num = alloca i32
  store i32 %_num, i32* %num
  %digit_list = alloca %struct.LinkedList*
  store %struct.LinkedList* null, %struct.LinkedList** %digit_list
  br label %loop_top18
  
  loop_top18:
  %tmp16 = load i32, i32* %num
  %tmp17 = icmp sgt i32 %tmp16, 0
  br i1 %tmp17, label %loop_body18, label %loop_exit18
  
  loop_body18:
  %tmp19 = load i32, i32* %num
  %tmp20 = srem i32 %tmp19, 10
  %rem = alloca i32
  store i32 %tmp20, i32* %rem
  %tmp21 = load i32, i32* %rem
  %tmp22 = load %struct.LinkedList*, %struct.LinkedList** %digit_list
  %tmp23 = call %struct.LinkedList* @make_ll (i32 %tmp21,%struct.LinkedList* %tmp22)
  store %struct.LinkedList* %tmp23, %struct.LinkedList** %digit_list
  %tmp24 = load i32, i32* %num
  %tmp25 = sdiv i32 %tmp24, 10
  store i32 %tmp25, i32* %num
  br label %loop_top18
  
  loop_exit18:
  %tmp26 = load %struct.LinkedList*, %struct.LinkedList** %digit_list
  %current = alloca %struct.LinkedList*
  store %struct.LinkedList* %tmp26, %struct.LinkedList** %current
  br label %loop_top29
  
  loop_top29:
  %tmp27 = load %struct.LinkedList*, %struct.LinkedList** %current
  %tmp28 = icmp ne %struct.LinkedList* %tmp27, null
  br i1 %tmp28, label %loop_body29, label %loop_exit29
  
  loop_body29:
  %tmp30 = load %struct.LinkedList*, %struct.LinkedList** %current
  %tmp31 = getelementptr inbounds %struct.LinkedList, %struct.LinkedList* %tmp30, i32 0, i32 0
  %tmp32 = load i32, i32* %tmp31
  %tmp33 = add i32 48, %tmp32
  %tmp34 = call i32 @putchar (i32 %tmp33)
  %tmp35 = load %struct.LinkedList*, %struct.LinkedList** %current
  %tmp36 = getelementptr inbounds %struct.LinkedList, %struct.LinkedList* %tmp35, i32 0, i32 1
  %tmp37 = load %struct.LinkedList*, %struct.LinkedList** %tmp36
  store %struct.LinkedList* %tmp37, %struct.LinkedList** %current
  br label %loop_top29
  
  loop_exit29:
  %tmp38 = load %struct.LinkedList*, %struct.LinkedList** %digit_list
  %tmp39 = call i32 @free_ll (%struct.LinkedList* %tmp38)
  ret i32 0
}

define i32 @main() {
  %tmp40 = call i32 @print_int (i32 1836284)
  %tmp41 = call i32 @putchar (i32 10)
  ret i32 0
}
