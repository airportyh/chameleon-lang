	.section	__TEXT,__text,regular,pure_instructions
	.macosx_version_min 10, 13
	.globl	_main                   ## -- Begin function main
	.p2align	4, 0x90
_main:                                  ## @main
	.cfi_startproc
## %bb.0:
	subq	$56, %rsp
	.cfi_def_cfa_offset 64
	movl	$84, 48(%rsp)
	movl	$72, 52(%rsp)
	leaq	48(%rsp), %rax
	movq	%rax, 40(%rsp)
	movl	$77, 32(%rsp)
	movl	$72, 36(%rsp)
	leaq	32(%rsp), %rax
	movq	%rax, 24(%rsp)
	movq	40(%rsp), %rax
	movl	(%rax), %edi
	callq	_putchar
	movq	40(%rsp), %rcx
	movl	4(%rcx), %edi
	movl	%eax, 20(%rsp)          ## 4-byte Spill
	callq	_putchar
	movl	$10, %edi
	movl	%eax, 16(%rsp)          ## 4-byte Spill
	callq	_putchar
	movq	24(%rsp), %rcx
	movl	(%rcx), %edi
	movl	%eax, 12(%rsp)          ## 4-byte Spill
	callq	_putchar
	movq	24(%rsp), %rcx
	movl	4(%rcx), %edi
	movl	%eax, 8(%rsp)           ## 4-byte Spill
	callq	_putchar
	movl	$10, %edi
	movl	%eax, 4(%rsp)           ## 4-byte Spill
	callq	_putchar
	xorl	%edx, %edx
	movl	%eax, (%rsp)            ## 4-byte Spill
	movl	%edx, %eax
	addq	$56, %rsp
	retq
	.cfi_endproc
                                        ## -- End function
.subsections_via_symbols
