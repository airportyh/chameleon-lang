	.section	__TEXT,__text,regular,pure_instructions
	.macosx_version_min 10, 13
	.globl	_main                   ## -- Begin function main
	.p2align	4, 0x90
_main:                                  ## @main
	.cfi_startproc
## %bb.0:
	pushq	%rbp
	.cfi_def_cfa_offset 16
	.cfi_offset %rbp, -16
	movq	%rsp, %rbp
	.cfi_def_cfa_register %rbp
	subq	$16, %rsp
	movl	$10, -4(%rbp)
	cmpl	$6, -4(%rbp)
	jle	LBB0_2
## %bb.1:                               ## %if_true3
	movq	%rsp, %rax
	addq	$-16, %rax
	movq	%rax, %rsp
	movl	$4, (%rax)
	movl	$65, %edi
	callq	_putchar
	jmp	LBB0_3
LBB0_2:                                 ## %if_false3
	movl	$67, %edi
	callq	_putchar
LBB0_3:                                 ## %if_exit3
	movl	$10, %edi
	callq	_putchar
	xorl	%ecx, %ecx
	movl	%eax, -8(%rbp)          ## 4-byte Spill
	movl	%ecx, %eax
	movq	%rbp, %rsp
	popq	%rbp
	retq
	.cfi_endproc
                                        ## -- End function
.subsections_via_symbols
