	.section	__TEXT,__text,regular,pure_instructions
	.macosx_version_min 10, 13
	.globl	_main                   ## -- Begin function main
	.p2align	4, 0x90
_main:                                  ## @main
	.cfi_startproc
## %bb.0:
	subq	$24, %rsp
	.cfi_def_cfa_offset 32
	movl	$65, 20(%rsp)
LBB0_1:                                 ## %loop_top3
                                        ## =>This Inner Loop Header: Depth=1
	cmpl	$91, 20(%rsp)
	jge	LBB0_3
## %bb.2:                               ## %loop_body3
                                        ##   in Loop: Header=BB0_1 Depth=1
	movl	20(%rsp), %edi
	callq	_putchar
	movl	$10, %edi
	movl	%eax, 16(%rsp)          ## 4-byte Spill
	callq	_putchar
	movl	20(%rsp), %ecx
	addl	$1, %ecx
	movl	%ecx, 20(%rsp)
	jmp	LBB0_1
LBB0_3:                                 ## %loop_exit3
	movl	$10, %edi
	callq	_putchar
	xorl	%ecx, %ecx
	movl	%eax, 12(%rsp)          ## 4-byte Spill
	movl	%ecx, %eax
	addq	$24, %rsp
	retq
	.cfi_endproc
                                        ## -- End function
.subsections_via_symbols
