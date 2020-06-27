	.section	__TEXT,__text,regular,pure_instructions
	.macosx_version_min 10, 13
	.globl	_makeLL                 ## -- Begin function makeLL
	.p2align	4, 0x90
_makeLL:                                ## @makeLL
	.cfi_startproc
## %bb.0:
	subq	$24, %rsp
	.cfi_def_cfa_offset 32
	movl	%edi, 20(%rsp)
	movq	%rsi, 8(%rsp)
	movl	$12, %edi
	callq	_malloc
	movq	%rax, %rcx
	movl	20(%rsp), %edx
	movl	%edx, (%rax)
	movq	8(%rsp), %rsi
	movq	%rsi, 8(%rax)
	movq	%rcx, %rax
	addq	$24, %rsp
	retq
	.cfi_endproc
                                        ## -- End function
	.globl	_main                   ## -- Begin function main
	.p2align	4, 0x90
_main:                                  ## @main
	.cfi_startproc
## %bb.0:
	subq	$24, %rsp
	.cfi_def_cfa_offset 32
	xorl	%eax, %eax
	movl	%eax, %esi
	movl	$68, %edi
	callq	_makeLL
	movl	$67, %edi
	movq	%rax, %rsi
	callq	_makeLL
	movl	$66, %edi
	movq	%rax, %rsi
	callq	_makeLL
	movl	$65, %edi
	movq	%rax, %rsi
	callq	_makeLL
	movq	%rax, 16(%rsp)
	movq	16(%rsp), %rax
	movq	%rax, 8(%rsp)
LBB1_1:                                 ## %loop_top14
                                        ## =>This Inner Loop Header: Depth=1
	cmpq	$0, 8(%rsp)
	je	LBB1_3
## %bb.2:                               ## %loop_body14
                                        ##   in Loop: Header=BB1_1 Depth=1
	movq	8(%rsp), %rax
	movl	(%rax), %edi
	callq	_putchar
	movq	8(%rsp), %rcx
	movq	8(%rcx), %rcx
	movq	%rcx, 8(%rsp)
	jmp	LBB1_1
LBB1_3:                                 ## %loop_exit14
	movl	$10, %edi
	callq	_putchar
	xorl	%ecx, %ecx
	movl	%eax, 4(%rsp)           ## 4-byte Spill
	movl	%ecx, %eax
	addq	$24, %rsp
	retq
	.cfi_endproc
                                        ## -- End function
.subsections_via_symbols
