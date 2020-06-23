	.section	__TEXT,__text,regular,pure_instructions
	.macosx_version_min 10, 13
	.globl	_main                   ## -- Begin function main
	.p2align	4, 0x90
_main:                                  ## @main
	.cfi_startproc
## %bb.0:
	pushq	%rax
	.cfi_def_cfa_offset 16
	movl	$24, 4(%rsp)
	cmpl	$20, 4(%rsp)
	jl	LBB0_2
## %bb.1:                               ## %if_true3
	movl	$68, %edi
	callq	_putchar
	jmp	LBB0_6
LBB0_2:                                 ## %if_false3
	cmpl	$10, 4(%rsp)
	jne	LBB0_4
## %bb.3:                               ## %if_true7
	movl	$67, %edi
	callq	_putchar
	jmp	LBB0_5
LBB0_4:                                 ## %if_false7
	movl	$66, %edi
	callq	_putchar
LBB0_5:                                 ## %if_exit7
	jmp	LBB0_6
LBB0_6:                                 ## %if_exit3
	movl	$10, %edi
	callq	_putchar
	xorl	%ecx, %ecx
	movl	%eax, (%rsp)            ## 4-byte Spill
	movl	%ecx, %eax
	popq	%rcx
	retq
	.cfi_endproc
                                        ## -- End function
.subsections_via_symbols
