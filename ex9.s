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
	subq	$32, %rsp
	movl	$65, -4(%rbp)
LBB0_1:                                 ## %loop_top3
                                        ## =>This Loop Header: Depth=1
                                        ##     Child Loop BB0_3 Depth 2
	cmpl	$91, -4(%rbp)
	jge	LBB0_6
## %bb.2:                               ## %loop_body3
                                        ##   in Loop: Header=BB0_1 Depth=1
	movq	%rsp, %rax
	addq	$-16, %rax
	movq	%rax, %rsp
	movl	$48, (%rax)
	movq	%rax, -16(%rbp)         ## 8-byte Spill
LBB0_3:                                 ## %loop_top6
                                        ##   Parent Loop BB0_1 Depth=1
                                        ## =>  This Inner Loop Header: Depth=2
	movq	-16(%rbp), %rax         ## 8-byte Reload
	cmpl	$57, (%rax)
	jg	LBB0_5
## %bb.4:                               ## %loop_body6
                                        ##   in Loop: Header=BB0_3 Depth=2
	movl	-4(%rbp), %edi
	callq	_putchar
	movq	-16(%rbp), %rcx         ## 8-byte Reload
	movl	(%rcx), %edi
	movl	%eax, -20(%rbp)         ## 4-byte Spill
	callq	_putchar
	movq	-16(%rbp), %rcx         ## 8-byte Reload
	movl	(%rcx), %edx
	addl	$1, %edx
	movl	%edx, (%rcx)
	jmp	LBB0_3
LBB0_5:                                 ## %loop_exit6
                                        ##   in Loop: Header=BB0_1 Depth=1
	movl	$10, %edi
	callq	_putchar
	movl	-4(%rbp), %ecx
	addl	$1, %ecx
	movl	%ecx, -4(%rbp)
	jmp	LBB0_1
LBB0_6:                                 ## %loop_exit3
	movl	$10, %edi
	callq	_putchar
	xorl	%ecx, %ecx
	movl	%eax, -24(%rbp)         ## 4-byte Spill
	movl	%ecx, %eax
	movq	%rbp, %rsp
	popq	%rbp
	retq
	.cfi_endproc
                                        ## -- End function
.subsections_via_symbols
